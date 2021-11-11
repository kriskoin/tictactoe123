#include <eosio/eosio.hpp>

#define LOW_BOUND_ROW 1
#define HIGH_BOUND_ROW 3
#define LOW_BOUND_COL 1
#define HIGH_BOUND_COL 3

#define HOST_MARK 1
#define CHALLENGER_MARK 2

using namespace eosio;
CONTRACT tictactoe123 : public contract {
    public:
        using contract::contract;
        TABLE game {
            uint128_t id;
            name challenger;
            name host;
            name turn = eosio::name("none");
            name winner = eosio::name("none");
            std::vector<uint8_t> board = {0,0,0,0,0,0,0,0,0};
            uint8_t marks = 0;
            uint128_t primary_key() const { return id; }
            uint64_t  by_challenger() const { return challenger.value; }
            EOSLIB_SERIALIZE( game, (id)(challenger)(host)(turn)(winner)(board)(marks))
        };

      typedef eosio::multi_index<name("games"), game,
       eosio::indexed_by<name("idxchall"), eosio::const_mem_fun<game, uint64_t, &game::by_challenger>>
      > games_table;

        ACTION welcome(name host , name opponent){
            require_auth(get_self());
            print ("Hola amigos");
        }

        ACTION create( name host, name challenger ){
            
            require_auth(host);
            check(challenger != host,"challenger and host must be diferent");
            games_table games(get_self(),get_self().value);

            //checks for the chagenller
            auto idx_chg = games.get_index<name("idxchall")>();
            auto tmp_chg = idx_chg.lower_bound(challenger.value);
            check(tmp_chg ==idx_chg.end(),"Challenger already exits"); 

            uint128_t tmp_key = uint128_t{host.value} << 64 | challenger.value;
            auto record = games.find( tmp_key);

            if( record == games.end() ){
                games.emplace(get_self(), [&]( auto& row ) {
                    row.id = tmp_key;
                    row.challenger = challenger;
                    row.host = host;  
                    row.turn = challenger;
                });
            }
            
        }

       ACTION move( 
           const name host,
           const name challenger,
           const name by,
           const uint8_t row,
           const uint8_t column 
           ){
            require_auth(by);
            check(challenger != host,"challenger and host must be diferent");
            check( (LOW_BOUND_ROW <= row  && row <= HIGH_BOUND_ROW ) ,"row value out of range");
            check( (LOW_BOUND_COL <= column  && column <= HIGH_BOUND_COL ) ,"column value out of range");
            
            games_table games(get_self(),get_self().value);
            uint128_t tmp_key = uint128_t{host.value} << 64 | challenger.value;
            auto itr = games.find( tmp_key);
            check(itr!=games.end(),"Game does not exists");
             //TODO check winner logic
            //check(record.winner == eosio::name("none") ,"game is over, winner detected");

            //TODO , fix the tie logic
            //check(((record.winner == eosio::name("none")) && (record.marks==9)),"game is over, tie detected");

            check(itr->turn == by ,"is not your turn");

            uint8_t board_position = get_position(row,column);
            check (is_empy_cell(board_position,itr->board),"This position is already used");
            
            //mark the move within the board
            uint8_t player_mark;
            name next_turn;
            if(by == host){
                player_mark= HOST_MARK;
                next_turn = challenger;
            }else{
                player_mark = CHALLENGER_MARK;
                next_turn = host;
            }

             games.modify(itr, get_self(), [&](auto &g) {
                g.board[board_position] = player_mark;
                g.turn = next_turn;
                //g.winner = getWinner(g);
                g.marks++;
            });
            
            
        }

        ACTION close( const name host,const name challenger ){
           
            require_auth(host);
            check(challenger != host,"challenger and host must be diferent");
            games_table games(get_self(),get_self().value);
            uint128_t tmp_key = uint128_t{host.value} << 64 | challenger.value;
            auto record = games.find( tmp_key);
            if( record != games.end() ){
                record = games.erase(record);
            }
            
        }

        ACTION clear( ){
            require_auth(_self);
            games_table games(get_self(),get_self().value);
            auto itr = games.begin();
            while (itr != games.end()) {
                itr = games.erase(itr);
            }
        }

        //is_valid_movement()
        //
       //get_winner()

        /**
        *
        *  This fuction translate the row and column
        *  to a position within vector
        * 
        * @param row - Row number of the board
        * @param column - Column number of the board
        *
        * @memo  the value or the row and column must be
        *        within  [LOW_BOUND_ROW,HIGH_BOUND_ROW ]
        *        and  [LOW_BOUND_COL,HIGH_BOUND_COL] ranges
        */
        uint8_t get_position (
           const uint8_t row,
           const uint8_t column
        ){
            return (row-1)*3 + (column-1);
        }

        
        /**
        *
        *  This fuction checks is a cell is empty
        * 
        * @param position - Position within the board
        * @param board - game board  std::vector<uint8_t>
        *
        * @memo  the value or the row and column must be
        *        within  [LOW_BOUND_ROW,HIGH_BOUND_ROW ]
        *        and  [LOW_BOUND_COL,HIGH_BOUND_COL] ranges
        */
        bool is_empy_cell (
           const uint8_t position,
           std::vector<uint8_t> board
        ){
            if (!board[position]){
                return true;
            }else{
                return false;
            }
        }

   
};